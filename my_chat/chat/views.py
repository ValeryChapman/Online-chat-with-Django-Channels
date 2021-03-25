from django.views.generic import View, TemplateView

class MainPageView(TemplateView):
    template_name = 'Chat/main.html'

class ChatView(TemplateView):
    template_name = 'Chat/chat.html'