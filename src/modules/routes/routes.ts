import { Router } from 'express'
import { createConstructor } from 'typescript'
import { constructorByName } from '../cabinet/constructor/controllers/constructors.controller'
import {
  createMyConstructorr,
  createMyConstructorrItems,
} from '../cabinet/constructorr/my-constructorr.controller'
import {
  myConstructorrs,
  myConstructorrById,
} from '../cabinet/constructorr/my-constructorrs.controller'
import {
  createMyAboutBureau,
  myAboutBureaus,
  updateMyAboutBureau,
} from '../cabinet/controllers/my-about-bureau.controller'
import { createMyAboutShchus } from '../cabinet/my-about-shchus/controllers/my-about-shchus.controller'
import { myAboutShchuses } from '../cabinet/my-about-shchus/controllers/my-about-shchuses.controller'
import { createMyArchiveHub } from '../cabinet/my-archive-hub/controllers/my-archive-hub.controller'
import {
  myArchiveHubs,
  myArchiveHubById,
} from '../cabinet/my-archive-hub/controllers/my-archive-hubs.controller'
import {
  createMyBlog,
  createMyBlogViewCount,
  myBlogPostFeatured,
} from '../cabinet/my-blog/controllers/my-blog.controller'
import {
  myBlogs,
  myBlogById,
  myBlogViewCount,
  myBlogPostIsFeatured,
} from '../cabinet/my-blog/controllers/my-blogs.controller'
import {
  createMyConstructorDesigner,
  createMyConstructorDesignerItems,
} from '../cabinet/my-constructor-designers/controllers/my-constructor-designer.controller'
import {
  myConstructorDesigners,
  myConstructorDesignerById,
} from '../cabinet/my-constructor-designers/controllers/my-constructor-designers.controller'
import { createMyConstructorIdea } from '../cabinet/my-constructor-ideas/controllers/my-constructor-idea.controller'
import { myConstructorIdeas } from '../cabinet/my-constructor-ideas/controllers/my-constructor-ideas.controller'
import { createMyConstructorMillion } from '../cabinet/my-constructor-million/controllers/my-constructor-million.controller'
import { myConstructorMillions } from '../cabinet/my-constructor-million/controllers/my-constructor-millions.controller'
import { createMyConstructorStartup } from '../cabinet/my-constructor-startups/controllers/my-constructor-startup.controller'
import { myConstructorStartups } from '../cabinet/my-constructor-startups/controllers/my-constructor-startups.controller'
import { createMyConstructorTalent } from '../cabinet/my-constructor-talents/controllers/my-constructor-talent.controller'
import { myConstructorTalents } from '../cabinet/my-constructor-talents/controllers/my-constructor-talents.controller'
import { createMyDBS500Club } from '../cabinet/my-dbs-500-club/controllers/my-dbs-500-club.controller'
import { myDBS500Clubs } from '../cabinet/my-dbs-500-club/controllers/my-dbs-500-clubs.controller'
import {
  createMyDBS500ClubIdea,
  createMyDBS500ClubIdeaItems,
} from '../cabinet/my-dbs-500-club/ideas/controllers/idea.controller'
import {
  myDBS500ClubIdeas,
  myDBS500ClubIdeaById,
} from '../cabinet/my-dbs-500-club/ideas/controllers/ideas.controller'
import { createMySlBrain } from '../cabinet/my-sl-brain/controllers/my-sl-brain.controller'
import { mySlBrains } from '../cabinet/my-sl-brain/controllers/my-sl-brains.controller'
import { createMySlFood } from '../cabinet/my-sl-food/controllers/my-sl-food.controller'
import { mySlFoods } from '../cabinet/my-sl-food/controllers/my-sl-foods.controller'
import { createMySlSport } from '../cabinet/my-sl-sport/controllers/my-sl-sport.controller'
import { mySlSports } from '../cabinet/my-sl-sport/controllers/my-sl-sports.controller'
import { createMySlTimeOfLife } from '../cabinet/my-sl-time-of-life/controllers/my-sl-time-of-life.controller'
import { mySlTimeOfLifes } from '../cabinet/my-sl-time-of-life/controllers/my-sl-time-of-lifes.controller'
import { createMySlWisdom } from '../cabinet/my-sl-wisdom/controllers/my-sl-wisdom.controller'
import { mySlWisdoms } from '../cabinet/my-sl-wisdom/controllers/my-sl-wisdoms.controller'
import { createMySldc } from '../cabinet/my-sldc/controllers/my-sldc.controller'
import { mySldces } from '../cabinet/my-sldc/controllers/my-sldces.controller'
import { createProduct } from '../cabinet/products/controllers/products.controllers'
import {
  createMyWorkshop,
  createMyWorkshopItems,
} from '../cabinet/workshop/controllers/workshop.controller'
import { myWorkshops, myWorkshopById } from '../cabinet/workshop/controllers/workshops.controller'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  router.post('/product', createProduct)
  // router.post('/constructor', createConstructor)
  router.get('/constructor-by', constructorByName)

  router.post('/my-sldc', createMySldc)
  router.get('/my-sldces', mySldces)

  // cb ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)

  router.post('/my-about-shchus', createMyAboutShchus)
  router.get('/my-about-shchuses', myAboutShchuses)

  router.post('/my-archive-hub', createMyArchiveHub)
  router.get('/my-archive-hubs', myArchiveHubs)
  router.get('/my-archive-hub-by', myArchiveHubById)

  router.post('/my-constructorr', createMyConstructorr)
  router.post('/my-constructorr-items', createMyConstructorrItems)
  router.get('/my-constructorrs', myConstructorrs)
  router.get('/my-constructorr-by', myConstructorrById)

  router.post('/my-constructor-designer', createMyConstructorDesigner)
  router.post('/my-constructor-designer-items', createMyConstructorDesignerItems)
  router.get('/my-constructor-designers', myConstructorDesigners)
  router.get('/my-constructor-designer-by', myConstructorDesignerById)

  router.post('/my-constructor-startup', createMyConstructorStartup)
  router.get('/my-constructor-startups', myConstructorStartups)

  router.post('/my-constructor-talent', createMyConstructorTalent)
  router.get('/my-constructor-talents', myConstructorTalents)

  router.post('/my-constructor-idea', createMyConstructorIdea)
  router.get('/my-constructor-ideas', myConstructorIdeas)

  router.post('/my-constructor-million', createMyConstructorMillion)
  router.get('/my-constructor-millions', myConstructorMillions)

  // cb-sl ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-sl-time-of-life', createMySlTimeOfLife)
  router.get('/my-sl-time-of-lifes', mySlTimeOfLifes)

  router.post('/my-sl-sport', createMySlSport)
  router.get('/my-sl-sports', mySlSports)

  router.post('/my-sl-food', createMySlFood)
  router.get('/my-sl-foods', mySlFoods)

  router.post('/my-sl-brain', createMySlBrain)
  router.get('/my-sl-brains', mySlBrains)

  router.post('/my-sl-wisdom', createMySlWisdom)
  router.get('/my-sl-wisdoms', mySlWisdoms)

  //blog ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-blog', createMyBlog)
  router.get('/my-blogs', myBlogs)
  router.get('/my-blog-by', myBlogById)
  router.post('/my-blog/view-count', createMyBlogViewCount)
  router.get('/my-blog/view-count', myBlogViewCount)
  router.post('/my-blog/post-featured', myBlogPostFeatured)
  router.post('/my-blog/post-is-featured', myBlogPostIsFeatured)

  //workshop ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/workshop', createMyWorkshop)
  router.post('/workshop-items', createMyWorkshopItems)
  router.get('/workshops', myWorkshops)
  router.get('/workshop-by', myWorkshopById)

  //club DBS-500 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-dbs-500-club', createMyDBS500Club)
  router.get('/my-dbs-500-clubs', myDBS500Clubs)

  router.post('/my-dbs-500-club/idea', createMyDBS500ClubIdea)
  router.post('/my-dbs-500-club/idea-items', createMyDBS500ClubIdeaItems)
  router.get('/my-dbs-500-clubs/ideas', myDBS500ClubIdeas)
  router.get('/my-dbs-500-club/idea-by', myDBS500ClubIdeaById)
  router.delete('/my-dbs-500-club/idea', createMyDBS500Club)
  router.put('/my-dbs-500-clubs/idea', myDBS500Clubs)

  return router
}
