# ItsABlog 
![Build Status](https://travis-ci.org/brianbrennan/itsablog.svg?branch=master)

An easy way to add blogging to your front end app


## What is it?

ItsABlog is a package that is used to turn your collection of markdown files into a consumable JSON file, so that you can easily add a blog to your application, without needing to build out or integrate a full CMS. Most blogging platforms are set up with bells and whistles that you might not need. If you're simply looking to get your articles easily from your text editor to your website, in a fully customizable way, this is the package for you.

## How to install

ItsABlog is integrated into npm as a public package. To install, enter the following into your command prompt, while in your project directory

```
npm install itsablog --save-dev
```

## How it works

ItsABlog is built to compile your blog files into data before you run your front end release / build. By setting up a script to integrate with ItsABlog, you can customize how you want your markdown files to be compiled and set up as JSON.

In order to use ItsABlog, you'll want to set up a runner script that initializes the package. Below is a simple example of a runner script.

```javascript
var ItsABlog = require('itsablog'),
    itsABlog = new ItsABlog();
    
itsABlog.outputToFile();

```
