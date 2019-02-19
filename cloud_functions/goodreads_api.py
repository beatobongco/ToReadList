import os

import goodreads_api_client as gr
from flask import abort, jsonify

client = gr.Client(developer_key=os.environ["GOODREADS_KEY"])


def suggest_books(q):
    # returns max of 3 books title, author along with goodreads ID
    try:
        return {
            "results": [
                {
                    "id": book["best_book"]["id"]["#text"],
                    "text": f"{book['best_book']['title']} - {book['best_book']['author']['name']}",
                    "image": book["best_book"]["image_url"],
                }
                for book in client.search_book(q)["results"]["work"][:3]
            ]
        }
    except KeyError:
        pass


def get_book(goodreads_id):
    # returns title, author, link based on goodreads id
    try:
        book = client.Book.show(goodreads_id)
        authors = book["authors"]["author"]
        if isinstance(authors, list):
            authors = ", ".join([author["name"] for author in authors])
        else:
            authors = authors["name"]
        return dict(
            title=book["title"],
            author=authors,
            link=book["url"],
            image=book["image_url"],
        )
    except KeyError:
        pass


def cloud_function(request):
    try:
        action = request.args["action"]
        res = None
        if action == "suggest":
            res = suggest_books(request.args["query"])
        elif action == "get_book":
            res = get_book(request.args["id"])
        response = jsonify(**res)
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "GET")
        return response
    except KeyError:
        abort(404)
