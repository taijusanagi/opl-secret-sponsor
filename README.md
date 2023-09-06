# Secret Sponsor

Account Abstraction Secret Gas Sponsoring with Oasis Privacy Layer.

![top](./asset/screenshot-1.png)

## Submission

### Live App

https://opl-secret-sponsor.vercel.app/

### Pitch Deck

https://docs.google.com/presentation/d/1q-E1k1spXqwVkbmQEpyljRFbDZX4P03jGf7bnFkKYk4/edit?usp=sharing

### Video Demo

https://youtu.be/JnP3FGQu4ds

## Problem Statement

Ensuring user privacy can be a complex challenge both technically and from a regulatory standpoint. Excessive privacy provisions can sometimes inadvertently enable undesirable activities such as money laundering. Consequently, smaller users find it difficult to maintain an optimal level of privacy.

## Solution & Benefits:

Secret Sponsor offers a mechanism for anonymous gas-sponsoring, incorporating account abstraction and the Oasis Privacy Layer.

Users can stay anonymous by:

- Initiate encrypted funding transactions in Sapphire.
- Bridge these funds to the Goerli account abstraction paymaster.
- Execute transactions without incurring gas fees.

Moreover, because the system focuses solely on gas-sponsoring, it becomes difficult to associate it with illicit actions such as money laundering. This is optimal privacy tailored for smaller users, particularly NFT artists.

## Technical Overview:

We've implemented a funding manager within Sapphire using the Oasis Privacy Layer. Users can carry out encrypted privacy-funding transactions, which are then synchronized to the Goerli paymaster. In addition, we have set up the Account Abstraction infrastructure on the Goerli network, utilizing the secret fund for transactions.

![diagram](/asset/diagram.png)

### Deployed Addresses

#### OPLAccountAbstractionPaymaster

https://goerli.etherscan.io/address/0xA4D01F4F04D6A62990CD56A09a1cc10568d966fE

##### Account Abstrasction Tx

https://www.jiffyscan.xyz/userOpHash/0xf0d04b8e23a15dc5322bde4cce6c6da980e16fb5884e46d72f6065c3f2dbd307?network=goerli

#### OPLAccountAbstractionEnclave

https://testnet.explorer.sapphire.oasis.dev/address/0xe976D36a90fAE9E590f17F28357d7EDBC729d0dc

##### Fund Tx

https://explorer.oasis.io/testnet/sapphire/tx/0x8bee73d024663c416897fa869b222690936478aba4d7c1229565cfac4085ffd7

## Challenges we ran into

- Working with the on-chain privacy layer was a new experience for me. Initially, understanding its function and application was challenging.
- Some preconditions were tricky to manage. I frequently sought help from the Oasis Discord community.

## Accomplishments that we're proud of

- I managed to integrate the Oasis Privacy Layer with an area I'm well-versed in - Account Abstraction. This showcased the immense potential of combining Account Abstraction with the Oasis Privacy Layer.

## What we learned

- On-chain privacy is truly invaluable!

## Future Roadmap

Although the funding transaction inputs are encrypted via Sapphire, there is room to enhance the pooling and synchronization mechanisms to fortify user-privacy. Our current focus is on a Proof of Concept (PoC) for secret funding with the Oasis Privacy layer, but our vision extends to developing and refining the infrastructure further.
