import { Request, Response } from 'express'
import db from '../../../db/knexKonfig'

export async function getAllSubscriptionItems(req: Request, res: Response) {
  try {
    const items = await db('subscription-items-ai').select('*').orderBy('id')
    res.status(200).json(items)
  } catch (error) {
    console.error('Error fetching subscription items:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getSubscriptionItemById(req: Request, res: Response) {
  try {
    const { id } = req.params
    const item = await db('subscription-items-ai').where({ id }).first()
    
    if (!item) {
      return res.status(404).json({ message: 'Subscription item not found' })
    }
    
    res.status(200).json(item)
  } catch (error) {
    console.error('Error fetching subscription item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function createSubscriptionItem(req: Request, res: Response) {
  try {
    const { description, unit, unit_cost, package: packageValue, price, dimension } = req.body
    
    const [newItem] = await db('subscription-items-ai')
      .insert({
        description,
        unit,
        unit_cost,
        package: packageValue,
        price,
        dimension
      })
      .returning('*')
    
    res.status(201).json(newItem)
  } catch (error) {
    console.error('Error creating subscription item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function updateSubscriptionItem(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { description, unit, unit_cost, package: packageValue, price, dimension } = req.body
    
    const [updatedItem] = await db('subscription-items-ai')
      .where({ id })
      .update({
        description,
        unit,
        unit_cost,
        package: packageValue,
        price,
        dimension,
        updated_at: db.fn.now()
      })
      .returning('*')
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Subscription item not found' })
    }
    
    res.status(201).json(updatedItem)
  } catch (error) {
    console.error('Error updating subscription item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function deleteSubscriptionItem(req: Request, res: Response) {
  try {
    const { id } = req.params
    
    const deletedCount = await db('subscription-items-ai').where({ id }).del()
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Subscription item not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting subscription item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
