---
layout: layouts/base.njk
title: Contact
---


<div class="container py-6">
  <div class="has-text-centered mb-4">
    <p class="title is-4">Reach out to us</p>
    <p class="subtitle is-6">
      Feel free to contact us with any questions or comments.
    </p>
  </div>
  <div class="box">
    <form name="contact" method="POST" data-netlify="true">
      <div class="field">
        <label class="label">Your Name</label>
        <div class="control">
          <input class="input" type="text" name="name" placeholder="e.g. Alex Smith" />
        </div>
      </div>
      <div class="field">
        <label class="label">Your Email</label>
        <div class="control">
          <input class="input" type="email" name="email" placeholder="e.g. alexsmith@gmail.com" />
        </div>
      </div>
      <div class="field">
        <label class="label">Message</label>
        <div class="control">
          <textarea class="textarea" name="message" placeholder="Type your message here..."></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <div data-netlify-recaptcha="true"></div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button type="submit" class="button is-primary">Send Message</button>
        </div>
      </div>
    </form>
  </div>
</div>


