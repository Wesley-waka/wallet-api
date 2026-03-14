import prisma from "../lib/prisma";

export async function getWalletValidate(username: string) {
    const wallet = await prisma.wallet.findUnique({
        where: {
            userName: username
        }
    });
    return wallet;
}

export async function depositWallet(username: string, amount: number) {
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

export async function updateWallet(username: string, amount: number) {
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


export async function withdrawWallet(username: string, amount: number) {
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

export async function fundWallet(username: string, amount: number) {
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

export async function createWallet(username: string) {
    const wallet = await prisma.wallet.create({
        data: {
            userName: username
        }
    });
    return wallet;
}

export async function creditWallet(username: string, amount: number) {
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

export async function debitWallet(username: string, amount: number) {
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
