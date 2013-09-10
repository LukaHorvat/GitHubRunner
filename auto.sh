whoami >/tmp/whoami.txt
screen -S GitHub -X quit
sleep 2s
screen -dmS GitHub -L bash -l -c "exec node server"