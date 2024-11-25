# Germanweb
Just a self study web app

# Prod
This is production branch

To host on your machine:
First
```
git clone https://github.com/kor5n/Germanweb.git
git checkout prod
git pull origin prod
```

Then
```
cd Germanweb
Germanweb/venv/bin/gunicorn -w <number of cores> -b <ip>:<port> wsgi:app
```

# ToDo
Add a co-ownership system

Add "favourites" to home 

optimize css for mobile devices

Add about page
