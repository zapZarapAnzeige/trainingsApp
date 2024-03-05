current_user=$(whoami)
if [ "$current_user" = "root" ]; then
docker-compose --env-file=../.env up 
else
    echo "Please execute the script as root"
fi