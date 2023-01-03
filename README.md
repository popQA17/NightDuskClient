## Prerequisites
Hello! Before you start, take some time to look through this list, and ensure you done all these steps first.
1. Have node.js installed on your computer
2. Have a text-based editor (if possible, use a code editor that has React auto-complete and syntax highlighting like Visual Studio Code)
3. Knowledge on editing JS / JSON files.
4. Cloned the github repository

## Installing dependencies
To start running the program, you need to install other required files. This process might take about 1 - 10 minutes depending on your network speed.
```
  npm install
```
While waiting, check out the next section.

## Configuring your config file
Configuring your config file is pretty simple and straightforward. Firstly, rename `config.js.example` to `config.js`.

Then, change the value `siteName` to what you want to call your site. This is under the `config` variable.

Next, change the value `siteKey` to the key provided by the owner of the github repository. If you do not have a site key, its likely that you do not have access to use the NightDusk Client. This is under the `creds` variable.

Last but not least, play around with the values in the `config` variable. Change homepage banners, accent colors, and your logo too! Next, feel free to customize the source code to your liking!

## Running the site
Running NightDusk is fairly simple, and can be done in 1 simple step. Run the below code on your console to compile a hot-reloading version of your site.
```
npm run dev
```
Then, you can navigate to http://localhost:3000 to view your site. The site updates when you save your files!
