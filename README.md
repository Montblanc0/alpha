# 🚀 Alpha 

Alpha is a web-app development project where you can share **pictures**, send **messages** and fetch daily data from [**NASA APOD API**](https://github.com/nasa/apod-api).

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456037-53148bea-aa6f-445b-8f33-21df5d5bd669.jpg"></img></p>

This project was built with [Ruby on Rails](https://rubyonrails.org/) v 7.0.4, [Turbo](https://turbo.hotwired.dev/) v7.2.0 and [Stimulus](https://stimulus.hotwired.dev/) v3.1.0 and was designed to implement CRUD operations on relational models while exploring Hotwire's rendering capabilities.

## Overview

Alpha is a SPA-(ish) responsive web application. Each section can easily be accessed from the top **navbar** which also hosts user controls. A global **notification** component is placed between the navbar and the main content and is responsible for showing `flash` notifications.

> Alpha is designed to take full advantage of Stimulus controllers, so JavaScript is essentially required, but precautions were taken so that the website is fully navigable even without JavaScript.

## Landing Page

The landing page is the `root_url` . Users are taken for a tour on a vertical **snap-scrolling** page where every section links to the related path.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456066-95c6a88a-bc87-4ebd-8a0b-0bfc6a56c418.gif"></img></p>

## Main Sections

The website is divided into three main sections: [Posts](#posts), [Messages](#messages) and [NASA](#nasa). Both Posts and Messages feature an **infinite scrolling** stream provided by the  [`kaminari gem`](https://github.com/kaminari/kaminari) pagination and an `IntersectionObserver` created by a dedicated Stimulus controller, which in turn makes `turbo-stream` requests to the server. A **WebSocket** is also configured on these public pages, with a `Turbo::StreamsChannel` automatically managing subscriptions and streams.

### Posts

This page shows a **live feed** of latest pictures posted by registered users. The `+` button takes users to the new post form, where they can choose to upload a file from their **storage** or from a **remote URL**. The [`carrierwave gem`](https://github.com/carrierwaveuploader/carrierwave) is configured to create a smaller resolution version which is stored on the server along with the original picture. New posts are broadcasted to the `/posts` path via a Turbo Stream.
Clicking on a post card will trigger the `posts#show` action which renders a page with a full resolution image and post details.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456089-32dd7943-fb14-4bac-9ad6-cfb9196755e4.gif"></img></p>

If the post is owned by a logged-in user, buttons to **edit** and **delete** will also be available.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456445-b00a57c4-e559-4eeb-bbcd-8f10dbfccbad.gif"></img></p>

### Messages

This page shows a **live feed** of latest messages sent by registered users. The `/messages` page was designed to take full advantage of `Turbo Streams` and `Turbo Frames`. The textarea on top is all it takes to send a message and immediately see it sliding on top of the list. `#create`, `#destroy` and `#update` actions on messages are asynchronously **broadcasted** to all subscribed users.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456477-72b82e7b-bc3c-4b51-8d46-1e38ecec69a9.gif"></img></p>

Messages sent by a logged-in user will show some controls on the top-right corner. Users can edit inline and delete a message without leaving the `/messages` path. 

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456473-f882484e-4629-404b-885b-2e45738b5df1.gif"></img></p>


### NASA

This is were you fetch [Nasa's Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html). Hit the `Go!` button to show today's picture with its title and explanation. Users can then **share** the picture as a `Post` by clicking on the `Share this picture!` button. You don't need to be logged in to fetch data, but a session is obviously needed for sharing.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456670-bcb2c84e-220f-43eb-aa15-660ca5ff05eb.gif"></img></p>

The API key used to send the request is the `DEMO_KEY` which is subject to limitations. To avoid putting a heavy and unnecessary load on the API, response properties are saved to local storage and are prioritized over sending a new request. Since the API updates itself at `0:00 UTC`, a check for outdated keys is performed and a new request is sent when necessary.

> Sometimes, the media type will be "video" instead of "image". In that case, the video will be embedded into an `<iframe>` and the share button will be unavailable. 

## User Auth and Validation

Users can register via the rightmost controls on the navbar. User creation validation is handled by validation helpers defined in the model and takes advantage of `field_with_error` wrappings.  Sessions are managed by a  `Session` controller along with a `current_user` method. The login page is mapped to `sessions#new` and uses client-side validations while the backend checks for presence.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205456916-2026fed1-b1a8-46d1-9a4b-a56142bb534a.gif"></img></p>

## User Profiles

User profiles are organized by **tabs**. Each tab contains a consistently styled content list which also features **infinite scrolling**. If the user viewing the profile is the `current_user`,  a tab to **edit user data** is shown.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205457291-ed05e92d-d546-4163-b162-cf740257be97.gif"></img></p>

# Database

This project uses Rails default `Active Record` ORM Framework on a simple `SQLite` database. Posts and Messages are linked by a `belongs_to` relationship with Users, which in turn `has_many` Posts and Messages.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/205458945-fad642ff-763c-4d12-ac1d-6e9d61fb41ba.png"></img></p>

# Layout and Style

Alpha's main styling library is [Bulma](https://bulma.io/). This library makes an extensive use of `flex` columns and media queries for **mobile** (< 768px ), **tablet** (>= 768px ) and **desktop** (>= 1024px), resulting in a responsive and elastic layout.

<p align="center"><img src="https://user-images.githubusercontent.com/645917/204380492-4d6fc783-d71d-4fcc-ac37-36d4758590b4.gif"></img></p>

# Development Setup

This project requires Rails 7.0.4 to be available on your machine. [Install Rails](https://guides.rubyonrails.org/getting_started.html#creating-a-new-rails-project-installing-rails "Install Rails") first if you haven't, clone the repo, open up a shell on the project root folder,  and paste the following commands:

```shell
bundle install
rails db:migrate
rails server
```

Puma will be listening on `http://localhost:3000` unless you explicitly changed port.

# Credits

All vendors are credited in project comments and every non-original content is either licensed or open-source. No copyright infringement is intended.

