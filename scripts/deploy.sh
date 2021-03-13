
#!/bin/bash

aws s3 sync dist/ s3://seen-v2 --acl public-read --profile seen.site --region eu-west-1
aws cloudfront create-invalidation --distribution-id ECNSM302N0P5G --paths '/*' --profile seen.site --region us-west-2
