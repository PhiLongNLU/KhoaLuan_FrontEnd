# KhoaLuan_FrontEnd

## Cau truc thu muc
```
KHOALUAN_FE/    
├── auth-service            #
│   └── const.py    
│   └── main.py             # run auth-service at here
│   └── model.py    
│   └── requirement.txt     #
│   └── response.py
├── PythonProject   
│   │   └── const.py
│   │   └── main.py         # run gateway service at here
├── qa_ui   
│   │   └── public/
│   │   └── src/                # 
│   │   └── package-lock.json
│   │   └── package.json
│   │   └── README.md
│   │   └── tsconfig.app.json
│   │   └── tsconfig.json
│   │   └── tsconfig.node.json
│   │   └── vite.config.json
```

## Huong dan khoi chay

### auth-service
```bash
# Kich hoat moi truong ao
python -m venv venv         ## Neu chua co moi truong ao
.\venv\Scripts\activate     ## Windows
source .venv/bin/activate    ## MacOS/Linux

# Cai dat thu vien
pip install -r requirement.txt

# Chay ung dung FastAPI
uvicorn main:app --reload
```

### qa_ui
```bash
npm install
npm run dev
```