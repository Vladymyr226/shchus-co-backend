import { Router } from 'express'
import { createProduct } from '../controllers/products.controllers'
import { createConstructor } from '../../constructor/controllers/constructor.controller'
import { constructorByName } from '../../constructor/controllers/constructors.controller'
import {
  createMyAboutBureau,
  deleteMyAboutBureau,
  myAboutBureaus,
  updateMyAboutBureau,
} from '../../my-about-bureau/controllers/my-about-bureau.controller'
import { createMyAboutShchus } from '../../my-about-shchus/controllers/my-about-shchus.controller'
import { myAboutShchuses } from '../../my-about-shchus/controllers/my-about-shchuses.controller'
import {
  myArchiveHubById,
  myArchiveHubs,
} from '../../my-archive-hub/controllers/my-archive-hubs.controller'
import { createMyArchiveHub } from '../../my-archive-hub/controllers/my-archive-hub.controller'
import {
  myConstructorDesignerById,
  myConstructorDesigners,
} from '../../my-constructor-designers/controllers/my-constructor-designers.controller'
import {
  createMyConstructorDesigner,
  createMyConstructorDesignerItems,
} from '../../my-constructor-designers/controllers/my-constructor-designer.controller'
import { createMyConstructorStartup } from '../../my-constructor-startups/controllers/my-constructor-startup.controller'
import { myConstructorStartups } from '../../my-constructor-startups/controllers/my-constructor-startups.controller'
import { createMyConstructorTalent } from '../../my-constructor-talents/controllers/my-constructor-talent.controller'
import { myConstructorTalents } from '../../my-constructor-talents/controllers/my-constructor-talents.controller'
import { createMyConstructorIdea } from '../../my-constructor-ideas/controllers/my-constructor-idea.controller'
import { myConstructorIdeas } from '../../my-constructor-ideas/controllers/my-constructor-ideas.controller'
import {
  createMyConstructorr,
  createMyConstructorrItems,
} from '../../constructorr/my-constructorr.controller'
import { myConstructorrs, myConstructorrById } from '../../constructorr/my-constructorrs.controller'
import { createMyConstructorMillion } from '../../my-constructor-million/controllers/my-constructor-million.controller'
import { myConstructorMillions } from '../../my-constructor-million/controllers/my-constructor-millions.controller'
import { createMySldc } from '../../my-sldc/controllers/my-sldc.controller'
import { mySldces } from '../../my-sldc/controllers/my-sldces.controller'
import { createMySlBrain } from '../../my-sl-brain/controllers/my-sl-brain.controller'
import { mySlBrains } from '../../my-sl-brain/controllers/my-sl-brains.controller'
import { createMySlFood } from '../../my-sl-food/controllers/my-sl-food.controller'
import { mySlFoods } from '../../my-sl-food/controllers/my-sl-foods.controller'
import { createMySlWisdom } from '../../my-sl-wisdom/controllers/my-sl-wisdom.controller'
import { mySlWisdoms } from '../../my-sl-wisdom/controllers/my-sl-wisdoms.controller'
import { createMySlTimeOfLife } from '../../my-sl-time-of-life/controllers/my-sl-time-of-life.controller'
import { mySlTimeOfLifes } from '../../my-sl-time-of-life/controllers/my-sl-time-of-lifes.controller'
import { createMySlSport } from '../../my-sl-sport/controllers/my-sl-sport.controller'
import { mySlSports } from '../../my-sl-sport/controllers/my-sl-sports.controller'
import {
  createMyBlog,
  createMyBlogViewCount,
  myBlogPostFeatured,
} from '../../my-blog/controllers/my-blog.controller'
import {
  myBlogById,
  myBlogPostIsFeatured,
  myBlogViewCount,
  myBlogs,
} from '../../my-blog/controllers/my-blogs.controller'
import { createMyDBS500Club } from '../../my-dbs-500-club/controllers/my-dbs-500-club.controller'
import { myDBS500Clubs } from '../../my-dbs-500-club/controllers/my-dbs-500-clubs.controller'
import {
  createMyDBS500ClubIdea,
  createMyDBS500ClubIdeaItems,
} from '../../my-dbs-500-club/ideas/controllers/idea.controller'
import {
  myDBS500ClubIdeaById,
  myDBS500ClubIdeas,
} from '../../my-dbs-500-club/ideas/controllers/ideas.controller'
import {
  createMyWorkshop,
  createMyWorkshopItems,
} from '../../workshop/controllers/workshop.controller'
import { myWorkshopById, myWorkshops } from '../../workshop/controllers/workshops.controller'

export function createCabinetRouter() {
  const router = Router({ mergeParams: true })

  router.post('/product', createProduct)
  router.post('/constructor', createConstructor)
  router.get('/constructor-by', constructorByName)

  router.post('/my-sldc', createMySldc)
  router.get('/my-sldces', mySldces)

  // cb ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  router.post('/my-about-bureau', createMyAboutBureau)
  router.get('/my-about-bureaus', myAboutBureaus)
  router.put('/my-about-bureau', updateMyAboutBureau)
  router.delete('/my-about-bureau', deleteMyAboutBureau)

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
