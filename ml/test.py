from pytubefix import YouTube # This is solution

yt = YouTube("https://www.youtube.com/watch?v=vLS-zRCHo-Y&list=PLAXnLdrLnQpRcveZTtD644gM9uzYqJCwr&index=56")
stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
stream.download()