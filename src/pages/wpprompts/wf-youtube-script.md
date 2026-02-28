NOTE: Every Id is unique and starts with a letter followed by 3 random numbers

# Project List for WP

## List of things to do

id: X393
type: list
pre-req: none
source: 

prompt: What are [count][focus-item] for a [type of person] who wants to [achieve-something]

example: What are 5 DIY projects for a 50 year software developer who wants to build something at home

output: There are many DIY projects that a 50-year-old software developer can take on, depending on their interests and skill level. Here are 5 ideas: ...

## Can you summarize?

id: Z173
type: followup, output-style
pre-req: text or list

prompt: Can you summarize [focus-concept] in [target-output]?

example: Can you summarize each point in 5-8 words?

output: 1..., 2..., 3..., 4..., 5...

## Can you shorten?

id: Z643
type: followup, output-style
pre-req: text or list



## Steps to do something

id: B883
type: list-ordered
pre-req: none

prompt: What do I need to [verb] a [focus-concept]

example: What do I need to build a smart home system

output: 1..., 2..., 3..., 4..., 5... (each of these was long form)

(1-2 combo): list-ordered + output-style

prompt: What do I need to build a smart home system (3-5 words per point)

## Write a YouTube script

id: Y523
type: content
pre-req: context "detailed subject, subject matter expert"

prompt: Write a YouTube script about [focus-concept]

example: Write a YouTube script on how to build a smart home system

output: Introduction, 1..., 2..., 3..., 4..., 5..., Conclusion

## Expand a point

id: E185
type: followup, content
pre-req: text or list

prompt: what is the [adjective] [noun] for [noun]?
example: what is the best skateboard deck size for beginners?
pattern: what is the [best] [skateboard deck size] for [beginners]?

prompt: what is the [adjective] [noun] for [noun]?
example: what is an easy IOT project for beginners?
pattern: what is the [easy] [IOT project] for [beginners]?


prompt: how do [nouns] [verb]?
example: how do cars work?
pattern: how do [cars] [work]?


prompt: can you [verb] [noun] about [noun] [preposition] [noun]?
example: Can you provide more information about medical procedures?
pattern: Can you [provide] [information] about [medical procedures]?

## Please simplify your response above

id: S983
type: followup, output-style
pre-req: text or list

parts: Can you simplify your response above?


prompt: how do [nouns] [verb]?
example: how do cars work?
pattern: how do [cars] [work]?

## Make a script more interesting

id: T513
type: followup, output-style
pre-req: text or list

prompt: can you [verb] the above [noun] more [adjective]?
example: can you make the above text more intriguing?
pattern: can you [make] the above [text] more [intriguing]?

prompt: can you [verb] the previous [noun] more [adjective]?
example: can you make the previous sentence more interesting?
pattern: can you [make] the previous [sentence] more [interesting]?

## Improve video intro so that ?

id: I753
type: surround, followup, output-style
pre-req: text

multi-prompt: 

  this is my next YouTube video about [subject]
  "[content body]""
  can you make this better? Please try to hook the viewer so they want to watch the rest of the video.

