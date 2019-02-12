import os

import goodreads_api_client as gr
from flask import abort, jsonify

client = gr.Client(developer_key=os.environ["GOODREADS_KEY"])


class add_cors_header(object):
    def __init__(self, f):
        self.f = f

    def __call__(self, *args):
        response = jsonify(**self.f(*args))
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "GET")
        return response


def suggest_book(q):
    # returns book title, author along with goodreads ID
    try:
        book = client.search_book(q)["results"]["work"][0]["best_book"]
        return {
            "id": book["id"]["#text"],
            "text": f"{book['title']} - {book['author']['name']}",
        }
    except KeyError:
        pass


def get_book(goodreads_id):
    # returns title, author, link based on goodreads id
    try:
        book = client.Book.show(goodreads_id)
        authors = book["authors"]["author"]
        print(type(authors))
        if isinstance(authors, list):
            authors = ", ".join([author["name"] for author in authors])
        else:
            authors = authors["name"]
        return dict(title=book["title"], author=authors, link=book["url"])
    except KeyError:
        pass


def cloud_function(request):
    try:
        action = request["action"]
        res = None
        if action == "suggest":
            res = suggest_book(request["query"])
        elif action == "get_book":
            res = get_book(request["id"])
        response = jsonify(**res)
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "GET")
        return response
    except KeyError:
        abort(404)
