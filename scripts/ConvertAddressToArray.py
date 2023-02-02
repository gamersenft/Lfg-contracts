from asyncore import write
import sys
import json

if __name__ == '__main__':
    try:
        [_, inputFile, outputFile] = sys.argv
    except:
        exit

    file = open(inputFile, 'r', encoding="utf8", errors="ignore")
    if not file:
        exit

    arrays = "["
    for line in file:
        # line[0: len(line) - 1] remove the '\n' at the end
        arrays = arrays + line[0: len(line) - 1] + ","
    
    arrays = arrays[0: len(arrays) - 1]
    arrays = arrays + "]"
    file.close()

    outfile = open(outputFile, 'w', encoding='utf8')
    outfile.write(arrays)
    outfile.close()