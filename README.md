# Meme Maker

Graphical interface for creating... memes! Or slides, or funny pictures - whatever you want to call them. Capabilities are somewhat similar to something like PowerPoint: you can add text boxes, basic shapes, SVGs, images, drop shadows, and outlines. At some point I'd like to add pre-built widgets, like a weather display, a calendar, a clock, etc.

For now, the core functionality is working, but this was a work in progress, and, like many of you, I am a collector of unfinished projects. But it's a fun project and I'd like to actually get it fully functional some day.

## Setup
As it stands, you should be able to get this working with the following steps:
- cd into the client folder and run `npm install`
- cd into the server folder:
  - run `npm install`
  - copy the `.env.example` file into a `.env` file and substitute your own values.
  - some things to note:
      - the connection string in `connection.js` is setup to work with MongoDB Atlas, so you'll either need to setup a MongoDB Atlas account to get the env vars, or you can modify the connection string if you'd rather run Mongo locally.
      - if you want to be able to upload images, you'll need to setup a Cloudinary account and add your account values into the .env. If you go this route, you'll also need to copy the `.env.example` in the client folder to a `.env` file and add your cloudinary cloud_name there.
- the client and server folders will need to be run in separate terminals - just run `npm start` in each, and off you go.

## Getting It Working
To start, register an account - a username and a password is all you need.

The Home page is blank (like I said, work in progress...), so just go to the canvas page and create a new canvas.
On the Canvas edit page, you have the main toolbar at the top, a more detailed sidebar on the right, and an image/svg/widget sidebar on the left.
- The Main Toolbar at the top lets you add shapes, textboxes, move objects forward or backward, group and ungroup items, undo and redo, and add an svg. To make it easy, I've included a couple of basic SVGs you can use in the `public` folder of this repo. You can upload any SVG you like, but if it's too complex the upload may time out.
- The Right Sidebar lets you manipulate objects in detail with positioning, sizing, stretching, alignment, shadows, colors, gradients, borders. You can also change the canvas size.
- The Left Sidebar is where you'll find images and SVGs you've uploaded and favorited on the Images page:
  - To add an image to the canvas, just double-click the thumbnail on the left, choose your options in the modal, and it will appear on the canvas.
  - For now, SVGs can only be added via the Toolbar at the top.
  - The widgets don't really do much at all just yet. I know the idea works because I built several widgets for a similar app at work, but never got around to it here. Someday, maybe. 

### Saving
The whole point of this is to be able to save the canvas as an image once it's done. The functionality is in place to save the canvas to an AWS S3 bucket as a webpage, but you'll need to use your own AWS account for that. To do so, just add the relevant AWS values to the `.env`. If you do that, you can see the saved AWS page by clicking the circle icon to the left of the canvas thumbnail on the main Canvas page. Display details aren't ironed out just yet, so scale and placement on the screen may not be correct. Functionality for saving the canvas as an image directly to your computer will be relatively easy to setup and will be forthcoming (provided I find the time).
