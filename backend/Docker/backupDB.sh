# generated with ChatGPT
current_user=$(whoami)
if [ "$current_user" = "root" ]; then
    docker exec trainingsApp_container mysqldump -u root -p3333 trainings_DB > ./bck/backup.sql
else
    echo "Please execute the script as root"
fi
