# generated with ChatGPT
current_user=$(whoami)
if [ "$current_user" = "root" ]; then
pip3 install fastapi
pip3 install uvicorn
pip3 install pydantic
pip3 install python-multipart
pip3 install python-jose[cryptography]
pip3 install passlib[bcrypt]
pip3 install sqlalchemy
pip3 install pymysql
pip3 install python-dotenv
pip3 install schedule
pip3 install websockets
pip3 install motor
else
    echo "Please execute the script as root"
fi

bck_dir="./Docker/bck"

if [ -d "$bck_dir" ]; then
    echo "Directory '$bck_dir' already exists."
else
    echo "creating '$bck_dir' Directory"
    mkdir ./Docker/bck
fi


