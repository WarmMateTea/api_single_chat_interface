# Sample .env file
PORT = 4001
OPENAI_API_KEY = openai_key
API_KEY = static_api_key

# Request info (post)
route: /api/summarize 

headers: 
  "x-api-key": API_KEY

body (json): 
  "content": base64_encoded_content
