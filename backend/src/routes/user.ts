import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "medium-comomn-ab";



export const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string
      JWT_secret: string
    }
  }>();


userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "inputs are not correct"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
   
  
   try{
  
    const user = await prisma.user.create({
      data:{
        email: body.email,
        password: body.password,
        name: body.name
      }
    })
  
    const jwt = await sign({ id: user.id },c.env.JWT_secret)
  
    return c.text(jwt)
  
  
  }catch(e){
    c.status(411)
     return c.text("invalid")
  }
  
  })
  
  userRouter.post('/signin', async (c) => {
    const body = await c.req.json()
    const { success } = signinInput.safeParse(body)
    if(!success){
      c.status(411);
      return c.json({
        message: "inputs are not correct"
      })
    }
  
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL ,
   }).$extends(withAccelerate());
  
  try{
   const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password
    }
   });
  
   if(!user){
    c.status(403)
    return c.json({message: "user not found"})
   }
  
   const jwt = await sign({id: user.id},c.env.JWT_secret);
   return c.json({jwt})
   
  }catch(e){
    console.log(e);
    c.status(411);
    return c.text("invalid")
  }
  })