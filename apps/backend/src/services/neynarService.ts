import axios from 'axios'

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || ''
const NEYNAR_API_URL = 'https://api.neynar.com/v2'

interface NeynarUser {
  fid: number
  username: string
  display_name: string
  pfp_url: string
  profile: {
    bio: {
      text: string
    }
  }
  follower_count: number
  following_count: number
}

export async function getNeynarUser(fid: string): Promise<NeynarUser | null> {
  if (!NEYNAR_API_KEY) {
    console.warn('NEYNAR_API_KEY not set, using mock data')
    return {
      fid: parseInt(fid),
      username: `user${fid}`,
      display_name: `User ${fid}`,
      pfp_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
      profile: {
        bio: {
          text: 'Farcaster user',
        },
      },
      follower_count: 0,
      following_count: 0,
    }
  }

  try {
    const response = await axios.get(`${NEYNAR_API_URL}/farcaster/user/bulk`, {
      params: { fids: fid },
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
    })

    const user = response.data.users?.[0]
    return user || null
  } catch (error) {
    console.error('Failed to fetch user from Neynar:', error)
    return {
      fid: parseInt(fid),
      username: `user${fid}`,
      display_name: `User ${fid}`,
      pfp_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
      profile: {
        bio: {
          text: 'Farcaster user',
        },
      },
      follower_count: 0,
      following_count: 0,
    }
  }
}

export async function getNeynarUsers(fids: string[]): Promise<NeynarUser[]> {
  if (!NEYNAR_API_KEY) {
    console.warn('NEYNAR_API_KEY not set, using mock data')
    return fids.map((fid) => ({
      fid: parseInt(fid),
      username: `user${fid}`,
      display_name: `User ${fid}`,
      pfp_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
      profile: {
        bio: {
          text: 'Farcaster user',
        },
      },
      follower_count: 0,
      following_count: 0,
    }))
  }

  try {
    const response = await axios.get(`${NEYNAR_API_URL}/farcaster/user/bulk`, {
      params: { fids: fids.join(',') },
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY,
      },
    })

    return response.data.users || []
  } catch (error) {
    console.error('Failed to fetch users from Neynar:', error)
    return fids.map((fid) => ({
      fid: parseInt(fid),
      username: `user${fid}`,
      display_name: `User ${fid}`,
      pfp_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fid}`,
      profile: {
        bio: {
          text: 'Farcaster user',
        },
      },
      follower_count: 0,
      following_count: 0,
    }))
  }
}
