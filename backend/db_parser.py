def check_if_data_exists(data, primary_column):
    if (len(data) == 1):
        if (data[0].get(primary_column) == None):
            return []

    return data

