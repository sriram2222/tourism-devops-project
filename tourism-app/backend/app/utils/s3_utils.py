import boto3
import os
from uuid import uuid4

s3 = boto3.client(
    's3',
    region_name=os.getenv('AWS_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
BUCKET = os.getenv('AWS_S3_BUCKET')

def upload_file_to_s3(file, filename=None):
    try:
        if filename is None:
            filename = str(uuid4()) + '_' + file.filename
        s3.upload_fileobj(
            file,
            BUCKET,
            filename,
            ExtraArgs={'ContentType': getattr(file, 'content_type', 'image/jpeg')}
        )
        return 'https://' + BUCKET + '.s3.amazonaws.com/' + filename
    except Exception as e:
        print('S3 error:', str(e))
        return None
