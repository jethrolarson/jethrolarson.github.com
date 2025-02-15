---
title: Jethro's Thoughts and Articles
layout: post
---
Sometimes I like to write up my thoughts and I'm getting tired of all my shit being locked behind increasingly corrupt walled gardens so I'm moving stuff here as I can. As you may guess I'm going to be inconsistent in my professionalism on this part of this site. I am not representing any of my employers here, I'm just a human.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <em class="deem">{{ post.date | date: "%B %d, %Y" }}</em>
    </li>
  {% endfor %}
</ul>