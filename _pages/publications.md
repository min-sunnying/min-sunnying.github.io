---
layout: collection
title: "Publications & Projects"
permalink: /publication/
---

<div class="publications">
  <h2>Publications</h2>
  {% for post in site.posts %}
    {% if post.categories contains "Publication" %}
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt }}</p>
    {% endif %}
  {% endfor %}
</div>

<div class="projects">
  <h2>Projects</h2>
  {% for post in site.posts %}
    {% if post.categories contains "Projects" %}
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt }}</p>
    {% endif %}
  {% endfor %}
</div>
