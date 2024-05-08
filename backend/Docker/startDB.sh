current_user=$(whoami)
echo "$(whoami)"
if [ "$current_user" = "root" ]; then
docker-compose --env-file=../.env  up -d
echo "created Container"
python3 ./scripts/insert_data_mongo.py
else
    echo "Please execute the script as root"
fi