# generated with ChatGPT
current_user=$(whoami)
if [ "$current_user" = "root" ]; then
pip3 install fastapi -q
pip3 install uvicorn -q
pip3 install pydantic -q
pip3 install python-multipart -q
pip3 install python-jose[cryptography] -q
pip3 install passlib[bcrypt] -q
pip3 install sqlalchemy -q
pip3 install pymysql -q
pip3 install python-dotenv -q
pip3 install schedule -q
pip3 install websockets -q
pip3 install motor -q
echo "installed modules"
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


