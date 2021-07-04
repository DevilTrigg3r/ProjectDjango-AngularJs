class GbifIdToLarge(Exception):
    """ Raised when a download dataset link of occurrences of Gbif API is not well-formed
        
    Attributes:
        message -- 
        explanation of the error
    """
    def __init__(self, message="The provided download link of Gbif API is not valid"):
        self.message = message
        super().__init__(self.message)
