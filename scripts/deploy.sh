
#!/bin/bash

aws s3 sync dist/ s3://seen-website --acl public-read --profile seen.site --region eu-west-2
aws cloudfront create-invalidation --distribution-id E34SKKJLLGI2Z9 --paths '/*' --profile seen.site --region us-west-2
