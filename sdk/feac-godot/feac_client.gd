extends Node
class_name FEACClient

var api_key: String
var base_url := "http://localhost:8000/v1"

func setup(key: String):
    api_key = key

func status(callback: Callable):
    var http := HTTPRequest.new()
    add_child(http)
    http.request_completed.connect(func(a,b,c,body):
        var res = JSON.parse_string(body.get_string_from_utf8())
        callback.call(res)
        http.queue_free()
    )
    http.request("http://localhost:9004/status",
        ["Content-Type: application/json"],
        HTTPClient.METHOD_POST,
        JSON.stringify({"api_key": api_key})
    )

func chat(msg: String, cost_type := "CHAT", callback: Callable):
    var http := HTTPRequest.new()
    add_child(http)
    http.request_completed.connect(func(a,b,c,body):
        var res = JSON.parse_string(body.get_string_from_utf8())
        callback.call(res)
        http.queue_free()
    )
    http.request(
        base_url + "/ai/chat",
        [
            "Content-Type: application/json",
            "x-api-key: " + api_key,
            "x-cost-type: " + cost_type
        ],
        HTTPClient.METHOD_POST,
        JSON.stringify({"messages":[{"role":"user","content":msg}]})
    )
