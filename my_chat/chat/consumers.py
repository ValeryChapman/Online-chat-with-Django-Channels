from channels.generic.websocket import AsyncWebsocketConsumer
import json


class AsyncChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        await self.channel_layer.group_send(
            self.room_name, 
            {
                'type': 'chat.message',
                'text': text_data
                #'text': self.scope['session']['my_var']
            }
        )
    
    async def chat_message(self, event):
        await self.send(text_data=event['text'])