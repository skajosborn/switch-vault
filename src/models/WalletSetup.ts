import mongoose from 'mongoose';

export interface IBeneficiary {
  id: string;
  name: string;
  walletAddress: string;
  percentage: number;
  email?: string;
  phone?: string;
}

export interface IWalletSetup extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  mainWallet: string;
  beneficiaries: IBeneficiary[];
  backupWallet?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const beneficiarySchema = new mongoose.Schema<IBeneficiary>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
});

const walletSetupSchema = new mongoose.Schema<IWalletSetup>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mainWallet: {
    type: String,
    required: true,
    trim: true,
  },
  beneficiaries: [beneficiarySchema],
  backupWallet: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Validate that beneficiaries total 100%
walletSetupSchema.pre('save', function(next) {
  if (this.beneficiaries.length > 0) {
    const totalPercentage = this.beneficiaries.reduce((sum, beneficiary) => sum + beneficiary.percentage, 0);
    if (totalPercentage !== 100) {
      return next(new Error('Beneficiaries percentages must total 100%'));
    }
  }
  next();
});

export default mongoose.models.WalletSetup || mongoose.model<IWalletSetup>('WalletSetup', walletSetupSchema);
