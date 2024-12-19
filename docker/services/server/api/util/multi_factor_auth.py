import hashlib
import hmac
import math
import time
from datetime import datetime, timezone

from api.constants.functions import ExceptionLogger


def dynamic_truncation(key, length):
    """Truncate the string to required length

    Args:
        key (int): hashed hmac key encrypted with timestamp in integer format
        length (int): length of truncated string

    Returns:
        string: return truncated code in stringified format
    """
    bitstring = bin(key)
    last_four_bits = bitstring[-4:]
    offset = int(last_four_bits, base=2)
    chosen_32_bits = bitstring[offset * 8 : offset * 8 + 32]
    full_totp = str(int(chosen_32_bits, base=2))
    return full_totp[-length:]


def generate_totp(shared_key, length=6):
    """generates a time based otp using the secret key and timestamp

    Args:
        shared_key (hash): url safe hashed hmac
        length (int, optional): length of otp. Defaults to 6.

    Returns:
        int: 6 digits otp code. length can be changed based on length argument
        string: hash hexdigest used to generate the otp
    """
    now_in_seconds = math.floor(time.time())
    step_in_seconds = 300  # for 5min 300, to test 60 or 120 can be used
    t = math.floor(now_in_seconds / step_in_seconds)
    hash_key = hmac.new(
        shared_key,
        t.to_bytes(length=8, byteorder="big"),
        hashlib.sha256,
    )
    hash_key_int = int(hash_key.hexdigest(), base=16)
    otp_code = dynamic_truncation(hash_key_int, length)
    return {"otp_code": otp_code, "code_hash": hash_key.hexdigest()}


def validate_totp(totp, otp_hash):
    """validating the otp provided

    Args:
        totp (string): otp that needs to be compared
        shared_key (hash): url safe hashed hmac

    Returns:
        boolean: returns whether the provided otp is valid or not
    """
    try:
        if otp_hash:
            otp_hash_int = int(otp_hash, base=16)
            trucated_otp = dynamic_truncation(otp_hash_int, 6)
            return totp == trucated_otp
    except Exception as ex:
        ExceptionLogger(ex)


def validate_timestamp(timestamp, duration=300, duration_in="seconds"):
    """compare the provided timestamp with current timestamp and check the difference between the two.

    Args:
        timestamp (datetime): timestamp that needs to be compared against current timestamp
        duration (int, optional): the number of duration. Defaults to 300.
        duration_in (str, optional): unit of duration can be seconds, microseconds and days. Defaults to 'seconds'.

    Returns:
        boolean: validates and return if the provided timestamp is less than or equal to the duration
    """
    try:
        cur_datetime = datetime.now(tz=timezone.utc)
        diff = cur_datetime - timestamp
        valid_now = False
        if duration_in == "seconds":
            valid_now = diff.seconds <= duration
        elif duration_in == "microseconds":
            valid_now = diff.microseconds <= duration
        elif duration_in == "days":
            valid_now = diff.days <= duration
        # TODO: for other units like hours, months or year logic can be added
        return valid_now
    except Exception as ex:
        ExceptionLogger(ex)
