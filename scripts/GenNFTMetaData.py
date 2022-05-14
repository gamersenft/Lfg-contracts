import os
import json

if not os.path.exists("./artifacts"):
    os.mkdir("./artifacts")

if not os.path.exists("./artifacts/metadata"):
    os.mkdir("./artifacts/metadata")

for i in range(200):
    meta = dict()
    tokenId = str(i + 1)
    meta["name"] = "Gamerse Fire NFT V2 #" + tokenId
    meta["description"] = "Limited edition Fire NFT Avatars, to serve as your Gamerse profile picture. This Revolutionising NFT collection has a built-in burn function of 5% $LFG each time its sold on the secondary market. \nThis unique feature creates scarcity and adds deflationary pressure increasing the value of the NFT overtime. Let the Gamerse begin!"
    meta["image"] = "https://gamerse.mypinata.cloud/ipfs/QmY76H7xCbYUg331BPT3qhnGH14Pb4Ur9nAUtaJBAM6hxQ/black_" + \
        tokenId + ".png"
    f = open("./artifacts/metadata/" + tokenId, "w")
    f.write(json.dumps(meta))
    f.close()
    
