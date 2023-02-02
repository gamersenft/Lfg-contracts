import os
import json

if not os.path.exists("./artifacts"):
    os.mkdir("./artifacts")

if not os.path.exists("./artifacts/metadata"):
    os.mkdir("./artifacts/metadata")

for i in range(722):
    meta = dict()
    tokenId = str(i + 1)
    imageId = str(i + 201)
    meta["name"] = "FireNFT#" + imageId
    meta["description"] = "Limited edition Gamerse NFT Avatars, to serve as your Gamerse profile picture. Let the Gamerse begin!"
    meta["image"] = "https://lavender-administrative-whitefish-464.mypinata.cloud/ipfs/QmbdLWNP648WHSUzjASdayS16gRq7fUJJcYnXrdxgpeb11/black_" + \
        imageId + ".png"
    f = open("./artifacts/metadata/" + tokenId, "w")
    f.write(json.dumps(meta))
    f.close()
