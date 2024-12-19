#!/bin/bash

# python3 /submission/main.py --dataset_path "/submission/train.json"
python3 /submission/main.py

# cd /submission/app
echo "watcher will start anytime now"
python3 /submission/app/file_watcher/watcher.py --flag "trainer" &

# python3 /submission/app/file_watcher/watcher.py --flag "checkpoint"

echo "We have now come to creation of train_script.sh"

chmod 777 /train_script.sh

sh /train_script.sh


# chmod 777 /export_model.sh

# sh /export_model.sh