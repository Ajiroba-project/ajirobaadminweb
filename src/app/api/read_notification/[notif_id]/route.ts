import { NextRequest, NextResponse } from 'next/server';

// Allow only digits or UUID-style IDs to prevent path traversal / injection
function isValidNotifId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  return /^\d+$/.test(trimmed) || /^[0-9a-fA-F-]{1,64}$/.test(trimmed);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { notif_id: string } }
) {
  try {
    const { notif_id } = params;

    if (!isValidNotifId(notif_id)) {
      return NextResponse.json(
        { status: 'failed', message: 'Invalid notification ID' },
        { status: 400 }
      );
    }
    
    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('token ')) {
      return NextResponse.json(
        { status: 'failed', message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('token ', '');

    // Make the API call to the backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/read_admin_notification/${notif_id}/`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    // console.log(data, "data")

    if (!response.ok) {
      // console.log(data, "data")
      return NextResponse.json(
        { 
          status: 'failed', 
          message: data.message || 'Failed to mark notification as read' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {

    // console.error('Read notification error:', error);
    return NextResponse.json(
      { 
        status: 'failed', 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
