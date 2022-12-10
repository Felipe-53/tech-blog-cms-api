FROM public.ecr.aws/lambda/nodejs:18

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN cp -R ./build/* ./

CMD [ "lambda-handler.handler" ]
