import asyncio

# import shutil
import io
import multiprocessing
import os
import runpy
import subprocess
import sys
import tempfile
import threading
import time
import uuid

import uvloop
from api.utils.constants import defaultCodeString

# import logging
# import traceback

dir_prefix = "nuclios_executor_"
file_prefix = "nuclios_executor_file_"
org_temp_dir = tempfile.gettempdir()
temp_dir = org_temp_dir

default_python_interpreter = "python"

default_code_string = defaultCodeString


async def create_temp_dir():
    global temp_dir, org_temp_dir, dir_prefix
    temp_dir = tempfile.mkdtemp(prefix=dir_prefix)


async def delete_temp_dir_files():
    try:
        for item in os.listdir(temp_dir):
            if (
                os.path.isfile(os.path.join(temp_dir, item))
                and (item.startswith(file_prefix))
                and (time.time() - float(str(item.split("_time_")[1]).replace("_", ".")) > 1000)
            ):
                os.remove(os.path.join(temp_dir, item))

        # if we are using a separate directory, then we can delete the directory
        # for item in os.listdir(org_temp_dir):
        #     if os.path.isdir(os.path.join(org_temp_dir, item)) and
        #           item.startswith(dir_prefix):
        #         print(temp_dir)
        #         print(os.path.join(org_temp_dir, item))
        #         if temp_dir == os.path.join(org_temp_dir, item):
        #             continue
        #         shutil.rmtree(os.path.join(org_temp_dir, item))
    except Exception:
        pass
        # print(f"Failed to delete file: {file_path}, Error: {e}")


async def delete_file_async(file_path):
    # Asynchronously delete the file
    try:
        os.remove(file_path)
        # shutil.rmtree(temp_dir, ignore_errors=True)
        # print(f"Deleted file: {file_path}")
    except Exception:
        pass
        # print(f"Failed to delete file: {file_path}, Error: {e}")


# def modify_element_queue(queue, indx, response):
#     items = []
#     while not queue.empty():
#         items.append(queue.get())
#     if items:
#         items[indx] = response
#     for item in items:
#         queue.put(item)
#     return queue


def send_response(queue, indx, response):
    if "put" not in dir(queue):
        # queue[indx] = response
        # return queue
        return queue.append({"indx": indx, "response": response})
    return queue.put({"indx": indx, "response": response})
    # return modify_element_queue(queue, indx, response)


def dynamic_file_name():
    file_name = file_prefix + "_time_" + str(time.time()) + "_time_" + str(uuid.uuid4())
    file_name = file_name.replace(".", "_")
    return file_name


def file_write_helper(input_json, code_string, start_time, result_queue, indx, file_name):
    try:
        if not input_json.get("with_file", False):
            file_path = "no_file"
            pass
        else:
            file_path = os.path.join(temp_dir, file_name + ".py")
            write_file(code_string, file_path)
        return True, "success", file_path

    except Exception as e:
        print(e)
        send_response(result_queue, indx, (None, None, str(e), time.time() - start_time, None))
        return False, "failure", ""


async def code_execution_process(input_json, result_queue, indx, extra_args={}):
    start_time = time.time()
    code_string = input_json.get("code_string", default_code_string)
    no_error, msg, file_path = file_write_helper(
        input_json, code_string, start_time, result_queue, indx, dynamic_file_name()
    )
    if not no_error:
        send_response(result_queue, indx, ("", "", msg, time.time() - start_time, None))
        return False, msg

    old_std_out = sys.stdout
    try:
        # Redirect stdout and stderr to capture output
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()
        sys.stdout = stdout_capture
        sys.stderr = stderr_capture

        # Execute the code in the given file
        input_var_dict = {"fact_check": 300}
        dynamic_outputs = {**input_var_dict}
        if file_path == "no_file":
            if code_string:
                # def code_exec(code_string, input_var_dict):
                #     global dynamic_output
                #     exec(code_string)
                #     g_keys = globals().keys()
                #     if "dynamic_output" in g_keys:
                #         dynamic_outputs["dynamic_output"] = dynamic_output
                # code_exec(code_string, input_var_dict)
                exec(code_string, dynamic_outputs)
        else:
            dynamic_outputs = runpy.run_path(file_path, init_globals=input_var_dict)

        dynamic_output = dynamic_outputs.get("dynamic_outputs", None)

        # Get the captured output
        stdout_output = stdout_capture.getvalue()
        stderr_output = stderr_capture.getvalue()

        send_response(
            result_queue, indx, (dynamic_output, stdout_output, stderr_output, time.time() - start_time, None)
        )

    except Exception as e:
        stdout_output = stdout_capture.getvalue()
        # trace_out = str(traceback.format_exc())
        exc_type, exc_value, exc_traceback = sys.exc_info()

        if "tb_next" in dir(exc_traceback) and exc_traceback.tb_next:
            line_number = exc_traceback.tb_next.tb_lineno
        else:
            line_number = exc_traceback.tb_lineno
        # tb_info = traceback.extract_tb(exc_traceback)
        # tb_filename = tb_info[-1][0]
        # stdout_output = {
        #     "tb_info": tb_info,
        #     "tb_filename": tb_filename,
        # }
        # In line {line_number}: \n\n
        trace_out = f"""{exc_type.__name__}: {exc_value}"""
        stderr_output = trace_out + "\n" + stderr_capture.getvalue()
        # str(e)+"\n"+
        send_response(result_queue, indx, (None, stdout_output, stderr_output, time.time() - start_time, line_number))
        print("Hii error " + str(e))
    finally:
        sys.stdout = old_std_out
        # asyncio.run_coroutine_threadsafe(delete_file_async(filename), a
        #   syncio.get_event_loop())
        # asyncio.create_task(delete_file_async(filename))


def run_async_function(target_fn, target_args):
    loop = uvloop.new_event_loop()
    # loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(target_fn(*target_args))
    loop.close()


async def thread_approach(target_fn, target_args):
    try:
        threads = []
        for target_arg in target_args:
            thread = threading.Thread(target=run_async_function, args=(target_fn, target_arg))
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()

        return True, "success"
    except Exception as e:
        return False, "failed: " + str(e)

    # try:
    #     thread = threading.Thread(target=run_async_function, args=(
    # target_fn, target_args))
    #     thread.start()
    #     thread.join()
    #     return True, "success"
    #     # print("thread is done", flush=True)
    # except Exception as e:
    #     return False, "failed: " + str(e)


async def process_approach(target_fn, target_args):
    try:
        processes = []
        for target_arg in target_args:
            process = multiprocessing.Process(target=run_async_function, args=(target_fn, target_arg))
            process.start()
            processes.append(process)

        for process in processes:
            process.join()

        return True, "success"
    except Exception as e:
        return False, "failed: " + str(e)


def write_file(code_string: str = "", file_path: str = ""):
    with open(file_path, "w") as f:
        if code_string:
            f.write(code_string)
            return


async def format_output(output: any):
    results_list = []
    # while True:
    for row in output:
        # if output.empty():
        #     break
        # row = output.get()
        if not row:
            break
        dynamic_output, stdout_output, stderr_output, code_execution_time, line_number = row
        results_list.append(
            {
                "value": dynamic_output,
                "stdout_output": stdout_output,
                "stderr_output": stderr_output,
                "time_taken": code_execution_time,
                "line_number": line_number,
            }
        )
    return results_list


def sub_process_approach_execution(input_json, result_queue, indx):
    try:
        python_interpreter = input_json.get("python_interpreter", default_python_interpreter)
        code_string = input_json.get("code_string", default_code_string)
        start_time = time.time()
        file_name = dynamic_file_name()
        output_file = file_name + ".json"
        code_string = (
            code_string
            + f"""

import tempfile
import os

temp_dir = tempfile.gettempdir()
file_path = os.path.join(temp_dir, "{output_file}")
with open(file_path, "w") as f:
    f.write(dynamic_outputs)
"""
        )
        no_error, msg, file_path = file_write_helper(input_json, code_string, start_time, result_queue, indx, file_name)
        if not no_error:
            return False, msg
        process = subprocess.Popen(
            [python_interpreter, file_path],
            # cwd="./",  # Specify the working directory for the subprocess
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        stdout, stderr = process.communicate()
        print(stdout)
        print(stderr)
        # returncode = process.wait()

        dynamic_output = ""
        with open(file_path.replace(".py", ".json"), "r") as f:
            dynamic_output = str(f.read())
            print(dynamic_output)

        stdout_output = stdout.decode("utf-8")
        stderr_output = stderr.decode("utf-8")

        send_response(
            result_queue, indx, (dynamic_output, stdout_output, stderr_output, time.time() - start_time, None)
        )

    except Exception as e:
        print(e)
        exc_type, exc_value, exc_traceback = sys.exc_info()
        if "tb_next" in dir(exc_traceback) and exc_traceback.tb_next:
            line_number = exc_traceback.tb_next.tb_lineno
        else:
            line_number = exc_traceback.tb_lineno
        # In line {line_number}: \n\n
        trace_out = f"""{exc_type.__name__}: {exc_value}"""
        stderr_output = trace_out

        send_response(result_queue, indx, (None, "", stderr_output, time.time() - start_time, line_number))
        return False, "failed: " + str(e)


def sub_process_approach(target_args):
    try:
        threads = []
        for target_arg in target_args:
            thread = threading.Thread(target=sub_process_approach_execution, args=target_arg)
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()

        return True, "success"
    except Exception as e:
        return False, "failed: " + str(e)


async def code_executor(input_json: any):
    try:
        start_time = time.time()

        run_approach = input_json.get("approach", "thread")
        input_json_len = len(input_json.get("code_strings", []))
        result_queue = []
        # ["{}" for _ in range(input_json_len)]
        if run_approach not in ["thread", "direct", "sub_process"]:
            # as process runs in completely different memory space,
            # we need to use multiprocessing.Queue() to get the result
            result_queue = multiprocessing.Queue()
            # [result_queue.put("{}") for _ in range(input_json_len)]

        target_args = []

        # Just for testing
        code_strings = input_json.get("code_strings", [])
        indx = 0
        for icode_strings_json in code_strings:
            target_args.append((icode_strings_json, result_queue, indx))
            indx += 1

        if run_approach == "thread":
            no_error, msg = await thread_approach(code_execution_process, target_args)
        elif run_approach == "direct":
            no_error, msg = True, ""
            try:
                for target_arg in target_args:
                    await code_execution_process(*target_arg)
            except Exception as e:
                no_error, msg = False, str(e)
        elif run_approach == "sub_process":
            no_error, msg = sub_process_approach(target_args)
        else:
            no_error, msg = await process_approach(code_execution_process, target_args)
            temp_lis = []
            while True:
                if result_queue.empty():
                    break
                temp_lis.append(result_queue.get())
            result_queue = temp_lis

        if not no_error:
            return {
                "dynamic_output": None,
                "stdout_output": None,
                "stderr_output": msg,
            }
        # dynamic_output, stdout_output, stderr_output,code_execution_time
        # = result_queue.get()
        tmp_list = ["{}" for _ in range(input_json_len)]
        for row in result_queue:
            indx = row.get("indx", 0)
            response = row.get("response", None)
            if response:
                tmp_list[indx] = response
        result_queue = tmp_list
        results = await format_output(result_queue)
        execution_time = time.time() - start_time

        print("Total Execution Time:", time.time() - start_time)
        output = {
            "results": results,
            "time_taken": execution_time,
        }
    except Exception as e:
        print(e)
        output = {
            "results": [],
            "dynamic_output": None,
            "stdout_output": None,
            "stderr_output": str(e),
            "line_number": None,
        }
    finally:
        # remove the file
        # asyncio.create_task(delete_file_async(file_path))
        return output


async def code_executor_service(input_json: any):
    return await code_executor(input_json)
