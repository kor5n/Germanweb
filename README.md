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

Then add a .env file to Germanweb/app:

```
cd Germanweb
touch app/.env
vim app/.env
```

Next, type neccessary dependencies in .env file:

> [!NOTE]  
> I don't really remember how to get the mail password for flask-mail but I have this [tutorial](https://www.youtube.com/watch?app=desktop&v=L7Cslucyyyo) on youtube that might help. Basically you would need to create a specific gmail account for this and specify the "less secure app" password (not the account password) at MAIL_PASSWORD in .env file.
```
MAIL_PASSWORD = "your password to your mail app at gmail"
SECRET_KEY = "random secure key"
```

And finally run the app!

```
Germanweb/venv/bin/gunicorn -w <number of cores> -b <ip>:<port> wsgi:app
```

# ToDo
Add a co-ownership system

Add "favourites" to home 

optimize css for mobile devices

Add about page
