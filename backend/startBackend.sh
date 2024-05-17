current_user=$(whoami)
set -a 
. "./.env"
set +a 

cd ./Docker
doesMongoContainerExist=$(docker-compose --env-file=../.env ps | grep "$MONGO_DB_CONTAINER_NAME")
if [ "$current_user" = "root" ]; then
    
    docker-compose --env-file=../.env  up -d
    echo "created Container"
    if [ -z "$doesMongoContainerExist" ]; then 
        # this is needed because of the creation of a gridFS bucket which can not be done in the init script of the container
        echo "inserting demo Data" 
        python3 ./scripts/insert_data_mongo.py
    fi
    cd ..
    uvicorn index:app --reload
else
    echo "Please execute the script as root"
fi