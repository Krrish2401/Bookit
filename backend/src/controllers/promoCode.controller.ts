import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validatePromoCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    
    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
      return;
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { 
        code: code.toUpperCase()
      }
    });

    if (!promoCode) {
      res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
      return;
    }

    if (!promoCode.isActive) {
      res.status(400).json({
        success: false,
        message: 'This promo code is no longer active'
      });
      return;
    }

    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      res.status(400).json({
        success: false,
        message: 'This promo code has expired'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        code: promoCode.code,
        discount: promoCode.discount,
        isActive: promoCode.isActive
      }
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code'
    });
  }
};
