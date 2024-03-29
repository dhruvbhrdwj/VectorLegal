import json
from app.engine.index import get_index
with open('prompt.json', 'r') as file:
    prompt_file = json.load(file)

def get_chat_engine():
    return get_index().as_chat_engine(
        similarity_top_k=3, 
        chat_mode="condense_plus_context",
        system_prompt = prompt_file['system_prompt']
    )
