import os
import json

if not os.path.exists("./artifacts"):
    os.mkdir("./artifacts")

if not os.path.exists("./artifacts/metadata"):
    os.mkdir("./artifacts/metadata")

for i in range(1000):
    meta = dict()
    tokenId = str(i + 1)
    imageId = str(i + 1101)
    meta["name"] = "FireNFT#" + imageId
    meta["description"] = "Limited edition Fire NFT Avatars, to serve as your Gamerse profile picture. This Revolutionising NFT collection has a built-in burn function of 5% $LFG each time its sold on the secondary market. \nThis unique feature creates scarcity and adds deflationary pressure increasing the value of the NFT overtime. Let the Gamerse begin!"
    meta["image"] = "https://gamerse.mypinata.cloud/ipfs/QmazrsmJJmvDCJ5PCuHSarqj4cdQq1qVSqB1AtewVhp2Ns/black_" + \
        imageId + ".png"
    f = open("./artifacts/metadata/" + tokenId, "w")
    f.write(json.dumps(meta))
    f.close()
    
