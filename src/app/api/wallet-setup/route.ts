import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WalletSetup from '@/models/WalletSetup';
import { authenticateRequest } from '@/lib/auth';

// GET - Retrieve user's wallet setup
export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const walletSetup = await WalletSetup.findOne({
      userId: auth.userId,
      isActive: true,
    });

    if (!walletSetup) {
      return NextResponse.json({
        mainWallet: '',
        beneficiaries: [],
        backupWallet: '',
      });
    }

    return NextResponse.json({
      mainWallet: walletSetup.mainWallet,
      beneficiaries: walletSetup.beneficiaries,
      backupWallet: walletSetup.backupWallet,
    });
  } catch (error: any) {
    console.error('Get wallet setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save or update user's wallet setup
export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { mainWallet, beneficiaries, backupWallet } = await request.json();

    // Validate input
    if (!mainWallet) {
      return NextResponse.json(
        { error: 'Main wallet address is required' },
        { status: 400 }
      );
    }

    if (!beneficiaries || beneficiaries.length === 0) {
      return NextResponse.json(
        { error: 'At least one beneficiary is required' },
        { status: 400 }
      );
    }

    // Validate beneficiaries total 100%
    const totalPercentage = beneficiaries.reduce((sum: number, beneficiary: any) => sum + beneficiary.percentage, 0);
    if (totalPercentage !== 100) {
      return NextResponse.json(
        { error: 'Beneficiaries percentages must total 100%' },
        { status: 400 }
      );
    }

    // Find existing wallet setup or create new one
    let walletSetup = await WalletSetup.findOne({
      userId: auth.userId,
      isActive: true,
    });

    if (walletSetup) {
      // Update existing setup
      walletSetup.mainWallet = mainWallet;
      walletSetup.beneficiaries = beneficiaries;
      walletSetup.backupWallet = backupWallet;
    } else {
      // Create new setup
      walletSetup = new WalletSetup({
        userId: auth.userId,
        mainWallet,
        beneficiaries,
        backupWallet,
      });
    }

    await walletSetup.save();

    return NextResponse.json({
      message: 'Wallet setup saved successfully',
      walletSetup: {
        mainWallet: walletSetup.mainWallet,
        beneficiaries: walletSetup.beneficiaries,
        backupWallet: walletSetup.backupWallet,
      },
    });
  } catch (error: any) {
    console.error('Save wallet setup error:', error);
    
    if (error.message.includes('Beneficiaries percentages must total 100%')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate user's wallet setup
export async function DELETE(request: NextRequest) {
  try {
    const auth = authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const walletSetup = await WalletSetup.findOne({
      userId: auth.userId,
      isActive: true,
    });

    if (walletSetup) {
      walletSetup.isActive = false;
      await walletSetup.save();
    }

    return NextResponse.json({
      message: 'Wallet setup deactivated successfully',
    });
  } catch (error: any) {
    console.error('Delete wallet setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
