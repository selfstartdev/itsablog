# ItsABlog 
![GitHub Build](https://github.com/brianbrennan/itsablog/actions/workflows/main.yml/badge.svg)
[![codecov](https://codecov.io/gh/brianbrennan/itsablog/branch/master/graph/badge.svg?token=RJA2HOQPL9)](https://codecov.io/gh/brianbrennan/itsablog)
 [![npm](https://img.shields.io/npm/v/itsablog.svg)](https://www.npmjs.com/package/itsablog) [![npm](https://img.shields.io/npm/dm/itsablog.svg)](https://www.npmjs.com/package/itsablog)

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

This will invoke the default settings, and will try to look for markdown files within `/blog` directory. It will take the data from there and output it to `blog.json`. These default settings can be overridden when you create a new instance of ItsABlog, simply by passing in an `options` object. For example, if you want to have it look for blog posts within `/app/blog/blog-posts`, and output the data to `blog_posts.json`, that can be done with the following

```javascript
var ItsABlog = require('itsablog'),
    itsablog = new ItsABlog({
        dir: './app/blog/blog-posts',
        output: './blog_posts.json'
    });

itsablog.outputToFile();
```
A list of options can be found in the Options section below

## Output Style

The output JSON for ItsABlog is set to contain each blog posts content, meta data about the file's creation date and it's last edited date, and is laid out in an object, whose key's are each of the file's names (without the `.md` file extension). So given the following folder structure...

```
blog
    |
    |->test.md
    |
    |->test2.md
```

the output JSON will look like this

```JSON
{
	"test": {
		"content": "Blog Post Content",
		"meta": {
			"creationDate": "2017-11-07T20:12:39.404Z",
			"lastEditedDate": "2017-11-07T20:12:39.404Z"
		}
	},
	"test2": {
		"content": "Other Blog Post Content",
		"meta": {
			"creationDate": "2017-11-08T20:12:39.404Z",
			"lastEditedDate": "2017-11-08T20:12:39.404Z"
		}
	}
}
```
ItsABlog compiles your markdown to html, and includes that as the content in your outputted JSON. It does this using the package [marked](https://github.com/chjj/marked), and uses default settings based on that package. In addition, ItsABlog also runs the given content through a character parser called [typeset](https://blot.im/typeset/). Visit their site to get a comprehensive list of character transformations.

## Custom Meta Data

ItsABlog by default adds metaData for lastEdited, and creation date for each item oututted. However, custom metadata might be something you need. ItsABlog comes with the ability to add in custom meta data of your choosing, written as simple JSON within your file. At the top of each blog post file, you can add in tags to represent your custom metadata. An example with the default meta data tags, in a file `test.md` is as follows

```markdown
<meta>
    {
        "title": "Test Blog Post",
        "tags": ["test", "development"]
    }
</meta>

## A Test Blog Post

Lorem Ipsum Deolorum
```

This will result in the following output when run with default settings

```JSON
{
	"test": {
		"content": "<h2 id=\"a-test-blog-post\">A Test Blog Post</h2>\n<p>Lorem Ipsum Deolorum</p>\n",
		"meta": {
			"creationDate": "2017-11-07T20:12:39.404Z",
			"lastEdited": "2017-11-22T18:18:11.331Z",
			"title": "Test Blog Post",
			"tags": [
				"test",
				"development"
			]
		}
	}
}
```
ItsABlog will simply look through your file's content looking for a `metaTagStart` and a `metaTagEnd`. You may end up having conflicts and issues if the content of your blog post includes the default options for these meta data boundaries. Because of this, there is the option to set custom meta tag boundary options when you instantiate ItsABlog. The following will behave with the exact same output as above, given the following runner script

```javascript
var ItsABlog = require('itsablog'),
    itsablog = new ItsABlog({
	metaTagStart: '<customMetaTag>',
	metaTagEnd: '</customMetaTag>'
    });

itsablog.outputToFile();
```
and the following content in `/blog/test.md`

```markdown
<customMetaTag>
    {
        "title": "Test Blog Post",
        "tags": ["test", "development"]
    }
</customMetaTag>

## A Test Blog Post

Lorem Ipsum Deolorum
```


## Options

The following is the defaultOptions object. Every key can be overridden by passing in a matching key in the options object when instantiating ItsABlog

```javascript
const defaultOptions = {
            metaTagStart: '<meta>',
            metaTagEnd: '</meta>',
            dir: 'blog',
            encoding: 'utf-8',
            pretty: true,
            output: 'blog.json'
        };
```

## Developoment

If you would like to contribute to this project, please clone the project to your local environment, and install dependencies for development

```
npm install
```

This project is written in ES6/ES2015, and built to ES5 for npm package publishing. To see the output of the test blog posts in the project, run the following

```
npm start
```

To have your ES6 build and written to the output file (which is the main file specified for npm), run the following

```
npm run build
```

Unit tests should be written for any and all changes made to this project. These should be written inside of respective files in the `/test` directory. This project's tests are written using [chai](https://chaijs.com), [chai-sinon](https://chaijs.com/plugins/sinon-chai/), and the [expect style](http://chaijs.com/api/bdd/).

Before submitting any changes, run the project's testing suite with the following

```
npm test
```

All changes should be submitted as a pull request, for review

## Features on Roadmap

* Allowing for nested blog folder structure
* Ability to read blog data structure from memory, rather than from output file
* Improve output script to display what actions have occurred
* Implement cli functionality so as to not require a runner script
