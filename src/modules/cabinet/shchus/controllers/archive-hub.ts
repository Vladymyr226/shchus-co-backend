import { Request, Response } from 'express'
import db from '../../../../db/knexKonfig'
import { CREATED, DELETED, UPDATED } from '../../../../middleware/error.middleware'

export async function createMyArchiveHub(req: Request, res: Response) {
    const json = req.body

    try {
        const newItem = await db('my_archive_hub').insert({ data: json }).returning('*')
        console.log(newItem)
        return res.status(201).json({ message: CREATED })
    } catch (error) {
        console.error('Error in archive-hub.ts', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function getMyArchiveHubs(req: Request, res: Response) {
    try {
        const getMyArchiveHub = await db('my_archive_hub').select('*')
        return res.status(200).json({ getMyArchiveHub })
    } catch (error) {
        console.error('Error in about-shchus.ts', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function getMyArchiveHub(req: Request, res: Response) {
    const { id } = req.query

    try {
        const getMyArchiveHubById = await db('my_archive_hub').select('*').where('id', id)
        return res.status(200).json({ getMyArchiveHubById })
    } catch (error) {
        console.error('Error in archive-hub.ts', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function updateMyArchiveHub(req: Request, res: Response) {
    const { id } = req.query
    const json = req.body

    try {
        await db('my_archive_hub').where({ id }).update({ data: json })
        return res.status(200).json({ message: UPDATED })
    } catch (error) {
        console.error('Error in archive-hub.ts', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export async function deleteMyArchiveHub(req: Request, res: Response) {
    const { id } = req.query

    try {
        await db('my_archive_hub').where({ id }).del()
        return res.status(200).json({ message: DELETED })
    } catch (error) {
        console.error('Error in archive-hub.ts', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}