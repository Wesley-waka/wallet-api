import { prisma } from "../lib/prisma";

async function getWalletValidate(username: string) {
    const wallet = await prisma.wallet.findUnique({
        where: {
            userName: username
        }
    });
    return wallet;
}

async function updateWalletBalance(username: string, amount: number) {
  return prisma.wallet.update({
    where: { userName: username },
    data: { balance: { increment: amount } },
  });
}


async function updateWallet(username: string, amount: number) {
    const wallet = await prisma.wallet.update({
        where: {
            userName: username
        },
        data: {
            balance: {
                increment: amount
            }
        }
    });
    return wallet;
}


async function withdrawFundsWallet(username: string, amount: number) {
    const wallet = await prisma.wallet.update({
        where: {
            userName: username
        },
        data: {
            balance: {
                decrement: amount
            }
        }
    });
    return wallet;
}

async function createWallet(username: string) {
    const wallet = await prisma.wallet.create({
        data: {
            userName: username
        }
    });
    return wallet;
}


async function debitWallet(username: string, amount: number) {
    const wallet = await prisma.wallet.update({
        where: {
            userName: username
        },
        data: {
            balance: {
                decrement: amount
            }
        }
    });
    return wallet;
}

export {
    getWalletValidate,
    updateWalletBalance,
    updateWallet,
    withdrawFundsWallet,
    createWallet,
    debitWallet
}

