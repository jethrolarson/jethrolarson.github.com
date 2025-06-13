---
layout: post
---
Here's some of my thoughts partially freed from the increasingly corrupt corporate walled gardens that plague the modern era. I am not representing any of my employers here, I'm just a human. No enshittification ever. 

<ul class="posts">
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <em class="deem">{{ post.date | date: "%B %d, %Y" }}</em>
    </li>
  {% endfor %}
</ul>