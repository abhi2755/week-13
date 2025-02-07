import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "medium-comomn-ab";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_secret: string
    },
    Variables: {
      userId: any
    }
}>();


blogRouter.use('/*', async(c, next)=>{
    const authHeader = c.req.header("authorization")||"";
    // const token = authHeader.split(" ")[1]
  
    const user = await verify(authHeader,c.env.JWT_secret);
    if(user){
      c.set("userId",user.id)
     await next()
    }else{
      c.status(403)
      return c.json({error:"unauthorized"})
    }
  })
  


blogRouter.post('/',async (c) => {
  const body= await c.req.json();

   const { success } = createBlogInput.safeParse(body)
      if(!success){
        c.status(411);
        return c.json({
          message: "inputs are not correct"
        })
      }
  
  const authorId = c.get("userId")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId
    }
  })

    return c.json({
      id: post.id
    })
  })
  
  blogRouter.put('/',async (c) => {
    const body= await c.req.json();
     const { success } = updateBlogInput.safeParse(body)
        if(!success){
          c.status(411);
          return c.json({
            message: "inputs are not correct"
          })
        }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const post = await prisma.post.update({
      where:{
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content,
     
      }
    })
  
      return c.json({
        id: post.id
      })
    })

    blogRouter.get('/bulk', async (c) => {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
  
      const posts = await prisma.post.findMany();
  
      return c.json({
        posts
      })
    })
  
  blogRouter.get('/:id', async(c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
      const post = await prisma.post.findUnique({
        where:{
          id: id
        }
      })
      return c.json({post})
    }catch(e){
      c.status(411);

      return c.json({
        message: "error while fetching data"
      })
    }
    
  })
  
  // add pagination in future
 